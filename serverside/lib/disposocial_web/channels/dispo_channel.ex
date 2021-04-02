defmodule DisposocialWeb.DispoChannel do
  use DisposocialWeb, :channel

  alias DisposocialWeb.Presence
  alias Disposocial.DispoServer

  require Logger

  @impl true
  def join("dispo:" <> id, %{"user_id" => user_id}, socket) do
    id = String.to_integer(id)
    if authorized?(socket) do
      noDispoServer? = Registry.lookup(Disposocial.DispoRegistry, id) == []
      if noDispoServer?, do: DispoServer.start(id)
      socket = assign(socket, :curr_dispo_id, id)
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
  def handle_in("leave", payload, socket0) do
    # TODO

  end

  @impl true
  def handle_in("post_post", payload, socket0) do
    # TODO

  end

  @impl true
  def handle_in("post_comment", payload, socket0) do
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
  # def handle_in("shout", payload, socket) do
  #   broadcast(socket, "shout", payload)
  #   {:noreply, socket}
  # end

end
