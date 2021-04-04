defmodule DisposocialWeb.DispoChannel do
  use DisposocialWeb, :channel

  alias DisposocialWeb.Presence
  alias Disposocial.{DispoServer, Dispos, Posts}

  require Logger

  @impl true
  def join("dispo:" <> id, %{"user_id" => user_id}, socket) do
    id = String.to_integer(id)
    dispo = Dispos.get_dispo(id)
    if authorized?(socket) && dispo do
      noDispoServer? = Registry.lookup(Disposocial.DispoRegistry, id) == []
      if noDispoServer?, do: DispoServer.start(id)
      socket = assign(socket, :curr_dispo_id, id)
      Process.send(self(), :after_join, [:nosuspend])
      {:ok, socket}
    else
      {:error, "Unauthorized"}
    end
  end

  # Add authorization logic here as required.
  defp authorized?(socket) do
    socket.assigns[:current_user] && true
  end

  @impl true
  def handle_info(:after_join, socket) do
    id = socket.assigns.curr_dispo_id
    dispo_name = Dispos.get_name!(id)
    user_name = socket.assigns.current_user.name
    push(socket, "doormat", %{body: "#{user_name} joined."})
    push(socket, "info", %{body: "Welcome to the #{dispo_name} Dispo!"})
    push(socket, "new_posts", %{many: Posts.recent_posts(id)})
    {:noreply, socket}
  end

  @impl true
  def handle_in("leave", %{"username" => username}, socket) do
    broadcast!(socket, "doormat", %{body: "#{username} left."})
  end

  @impl true
  def handle_in("post_post", %{"body" => body} = payload, socket) do
    attrs = %{
      body: body,
      user_id: socket.assigns.current_user.id,
      dispo_id: socket.assigns.curr_dispo_id
    }

    case Posts.create_post(attrs) do
      {:ok, post} ->
        broadcast!(socket, "new_posts", %{one: Posts.present(post)})
        {:reply, :ok, socket}
      {:error, chgset} -> {:reply, {:error, chgset.errors}, socket}
    end
  end

  @impl true
  def handle_in("post_comment", payload, socket) do
    # TODO

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
