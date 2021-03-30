defmodule Disposocial.Plugs.RequireAPIAuth do
  import Plug.Conn

  alias Disposocial.Users

  require Logger

  def init(opts), do: opts

  def call(conn, _params) do
    # Logger.debug("PLUG conn ---> #{inspect(conn)}")
    token = case get_req_header(conn, "x-auth") do
      [tok] -> tok
      _ -> nil
    end
    Logger.debug("PLUG token ---> #{inspect(token)}")
    unless is_nil(token) do
      # NOTE 86_400 is 24 hours in seconds
      case Phoenix.Token.verify(conn, "hello user", token, max_age: 86_400) do
        {:ok, user_id} ->
          conn
          |> assign(:current_user, Users.get_user!(user_id))
        {:error, :expired} ->
          conn
          |> send_resp(401, Jason.encode!(%{
            error: ["Unauthorized", "Token expired"]
            }))
          |> halt()
        {:error, :invalid} ->
          conn
          |> send_resp(401, Jason.encode!(%{
            error: ["Unauthorized", "Token invalid"]
            }))
          |> halt()
        _ ->
          conn
          |> send_resp(400, Jason.encode!(%{error: ["Bad token"]}))
          |> halt()
      end
    else
      conn
      |> send_resp(401, Jason.encode!(%{error: ["Unauthorized"]}))
      |> halt()
    end
  end

end
