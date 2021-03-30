defmodule DisposocialWeb.DispoChannel do
  use DisposocialWeb, :channel

  alias DisposocialWeb.Presence

  require Logger

  @impl true
  def join("dispo:" <> id, %{"user_id" => user_id}, socket) do
    if authorized?(socket) do
      Logger.debug("Init dispo channel")
      socket = assign(socket, :curr_dispo_id, id)
      {:ok, socket}
    else
      {:error, "Unauthorized"}
    end
  end

  # Add authorization logic here as required.
  # TODO use Phoenix.Token.verify on sent session???
  defp authorized?(socket) do
    socket.assigns[:current_user] && true
  end

  #@impl true
  #def handle_in("default:register", _params) do
    # TODO validate (proper fields, name not in use,
    # password good, email validation), hash password,
    # create db User, set session + api token
  #end

  # @impl true
  # def join("default:lobby", payload, socket) do
  #   if authorized?(payload) do
  #     {:ok, socket}
  #   else
  #     {:error, %{reason: "unauthorized"}}
  #   end
  # end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (default:lobby).
  # @impl true
  # def handle_in("shout", payload, socket) do
  #   broadcast(socket, "shout", payload)
  #   {:noreply, socket}
  # end

end
