defmodule DisposocialWeb.DispoChannel do
  use DisposocialWeb, :channel

  alias DisposocialWeb.{Presence, ChangesetView}
  alias Disposocial.{DispoServer, Dispos, Posts, Util}

  require Logger

  @impl true
  def join("dispo:" <> id, params, socket) do
    Logger.debug("GOT DISPO JOIN PARAMS --> #{inspect(params)}")
    id = String.to_integer(id)
    dispo_pass = params["password"] |> Util.escapeInput()
    if sock_authorized?(socket) &&
        Dispos.exists?(id) && dispo_authorized?(id, dispo_pass) do
      noDispoServer? = Registry.lookup(Disposocial.DispoRegistry, id) == []
      Logger.debug("Dispo server found?? #{inspect(noDispoServer?)}")
      if noDispoServer?, do: DispoServer.start(id)
      socket = assign(socket, :curr_dispo_id, id)
      Process.send(self(), :after_join, [:nosuspend])
      {:ok, socket}
    else
      {:error, "unauthorized"}
    end
  end

  # Add authorization logic here as required.
  defp sock_authorized?(socket) do
    socket.assigns[:current_user] && true
  end

  defp dispo_authorized?(id, dispo_pass) do
    Dispos.authenticate(id, dispo_pass)
  end

  @impl true
  def handle_info(:after_join, socket) do
    dispo_id = socket.assigns.curr_dispo_id
    user_name = socket.assigns.current_user.name
    Logger.debug("Got dispo id --> #{inspect(dispo_id)}")
    dispo = DispoServer.get_dispo(dispo_id)

    push(socket, "dispo_meta", %{data: dispo})
    push(socket, "info", %{data: "Welcome to the #{dispo.name} Dispo!"})
    broadcast!(socket, "doormat", %{data: "#{user_name} joined."})

    {:noreply, socket}
  end

  @impl true
  def handle_in("leave", %{"username" => username}, socket) do
    broadcast!(socket, "doormat", %{data: "#{username} left."})
    {:noreply, socket}
  end

  @impl true
  def handle_in("recent_posts", _payload, socket) do
    dispo_id = socket.assigns.curr_dispo_id
    payload = %{many: DispoServer.get_recent_posts(dispo_id)}
    {:reply, {:ok, payload}, socket}
  end

  @impl true
  def handle_in("recent_comments", _payload, socket) do
    dispo_id = socket.assigns.curr_dispo_id
    payload = %{many: DispoServer.get_recent_comments(dispo_id)}
    {:reply, {:ok, payload}, socket}
  end

  @impl true
  def handle_in("recent_reactions", _payload, socket) do
    dispo_id = socket.assigns.curr_dispo_id
    payload = %{many: DispoServer.get_recent_reactions(dispo_id)}
    {:reply, {:ok, payload}, socket}
  end

  @impl true
  def handle_in("popular_posts", _payload, socket) do
    dispo_id = socket.assigns.curr_dispo_id
    payload = %{data: DispoServer.get_popular_posts(dispo_id)}
    {:reply, {:ok, payload}, socket}
  end

  @impl true
  def handle_in("fetch_posts", post_ids, socket) do
    dispo_id = socket.assigns.curr_dispo_id
    payload = %{data: DispoServer.get_posts(dispo_id, post_ids)}
    {:reply, {:ok, payload}, socket}
  end

  @impl true
  def handle_in("fetch_post", %{"post_id" => post_id}, socket) do
    dispo_id = socket.assigns.curr_dispo_id
    payload = %{data: DispoServer.get_post(dispo_id, post_id)}
    {:reply, {:ok, payload}, socket}
  end

  @impl true
  def handle_in("post_post", %{"body" => body} = _params, socket) do
    attrs = %{
      body: Util.escapeInput(body),
      user_id: socket.assigns.current_user.id,
      dispo_id: socket.assigns.curr_dispo_id
    }

    case DispoServer.post_post(socket.assigns.curr_dispo_id, attrs) do
      {:ok, post} ->
        broadcast!(socket, "new_posts", %{one: %{post.id => post}})
        {:reply, :ok, socket}
      {:error, errors} -> {
        :reply,
        {:error, ChangesetView.translate_errors(errors)},
        socket
      }
    end
  end

  @impl true
  def handle_in("post_comment", %{"post_id" => post_id, "body" => body}, socket) do
    attrs = %{
      body: Util.escapeInput(body),
      user_id: socket.assigns.current_user.id,
      post_id: post_id
    }

    Logger.debug("POSTING COMMET WIT --> #{inspect(attrs)}")

    case DispoServer.post_comment(socket.assigns.curr_dispo_id, attrs) do
      {:ok, comment} ->
        payload = %{post_id: post_id, data: comment}
        broadcast!(socket, "new_post_comments", %{one: payload})
        {:reply, :ok, socket}
      {:error, errors} -> {
        :reply,
        {:error, ChangesetView.translate_errors(errors)},
        socket
      }
    end
  end

  @impl true
  def handle_in("post_reaction", %{"post_id" => post_id, "reaction" => reaction}, socket) do
    attrs = %{
      post_id: post_id,
      user_id: socket.assigns.current_user.id,
      value: reaction
    }

    Logger.debug("POSTING REACTION WIT --> #{inspect(attrs)}")

    case DispoServer.post_reaction(socket.assigns.curr_dispo_id, attrs) do
      :created ->
        payload = %{post_id: post_id, data: reaction}
        broadcast!(socket, "new_post_reactions", %{created: 1, one: payload})
        {:reply, :ok, socket}
      :updated ->
        payload = %{post_id: post_id, data: reaction}
        broadcast!(socket, "new_post_reactions", %{updated: 1, one: payload})
        {:reply, :ok, socket}
      :noop -> {:reply, :ok, socket}
      {:error, errors} -> {
        :reply,
        {:error, ChangesetView.translate_errors(errors)},
        socket
      }
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (default:lobby).
  # @impl true
  # def handle_in("new_post", payload, socket) do
  #   broadcast(socket, "new_post", payload)
  #   {:noreply, socket}
  # end

end
