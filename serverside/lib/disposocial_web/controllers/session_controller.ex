defmodule DisposocialWeb.SessionController do
  use DisposocialWeb, :controller

  alias Disposocial.Users

  def create(conn, %{"email" => email, "password" => password}) do
    # if registered usercreate JWT and pass back
    case Users.authenticate(email, password) do
      # Generating a signed token here. Second arg is some more custom
      # salt which makes cracking more difficult. It will implicitly
      # add a signature date to the token which we can use to verify later.
      # MUST generate tokens with something unique (user id, etc).
      # can only sign on entities like sockets, conns, and endpoints
      {:ok, user} ->
        token = Phoenix.Token.sign(conn, "hello user", user.id)
        session = %{
          user_id: user.id,
          username: user.name,
          token: token,
          time: DateTime.utc_now()
        }
        conn
        |> assign(:current_user, user)
        |> put_resp_header("Content-Type", "application/json")
        |> send_resp(200, Jason.encode!(session))
        _ ->
        conn
        |> put_resp_header("Content-Type", "application/json")
        |> send_resp(401, Jason.encode!(%{error: ["Authentication failed."]}))
    end
  end

end
