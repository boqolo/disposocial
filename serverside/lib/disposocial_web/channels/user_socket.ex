defmodule DisposocialWeb.UserSocket do
  use Phoenix.Socket

  require Logger

  ## Channels
  # channel "room:*", DisposocialWeb.RoomChannel
  channel("default:*", DisposocialWeb.DefaultChannel)
  channel("dispo:*", DisposocialWeb.DispoChannel)

  # Socket params are passed from the client and can
  # be used to verify and authenticate a user. After
  # verification, you can put default assigns into
  # the socket that will be set for all channels, ie
  #
  #     {:ok, assign(socket, :user_id, verified_user_id)}
  #
  # To deny connection, return `:error`.
  #
  # See `Phoenix.Token` documentation for examples in
  # performing token verification on connect.
  @impl true
  def connect(%{"token" => token}, socket, _connect_info) do
    # THIS IS THE SOCKET CONSTRUCTOR
    # Any user needs to authenticate to get a channel connection
    # They should have a token that we've previouslt given from the API
    # and need to send it here
    Logger.debug("Authenticating client")
    case Phoenix.Token.verify(socket, "hello user", token, max_age: 86_400) do
      {:ok, user_id} -> {:ok, assign(socket, :current_user, user_id)}
      {:error, :expired} ->
        Logger.info("Token expired")
        :error
      {:error, :invalid} ->
        Logger.info("Token invalid")
        :error
      _ ->
        Logger.info("Token failure")
        :error
    end
  end

  # Socket id's are topics that allow you to identify all sockets for a given user:
  #
  #     def id(socket), do: "user_socket:#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  #     DisposocialWeb.Endpoint.broadcast("user_socket:#{user.id}", "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous.
  @impl true
  def id(_socket), do: nil
end
