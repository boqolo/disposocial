defmodule DisposocialWeb.UserController do
  use DisposocialWeb, :controller

  plug Disposocial.Plugs.RequireAPIAuth when action not in [:create]

  alias Disposocial.Users
  alias Disposocial.Users.User

  require Logger

  action_fallback DisposocialWeb.FallbackController

  def index(conn, _params) do
    users = Users.list_users()
    render(conn, "index.json", users: users)
  end

  defp convertKList(keyword) do
    for {k, v} <- keyword, into: %{} do
      {k, hd(Tuple.to_list(v))}
    end
  end

  defp remove_hash_errors(chgset) do
    %{chgset | errors: Keyword.drop(chgset.errors, [:password_hash, :media_hash])}
  end

  def create(conn, %{"user" => user_params}) do
    email = user_params["email"]
    unless Users.get_user_by_email(email) do
      Logger.debug("ENTERING")
      case Users.create_user(user_params) do
        {:ok, %User{} = user} ->
          Logger.debug("MADE USER --> #{inspect(user)}")
          conn
          |> put_status(:created)
          |> put_resp_header("location", Routes.user_path(conn, :show, user))
          |> render("show.json", user: user)
        {:error, chgset} ->
          Logger.debug("ERROR --> #{inspect(chgset)}")
          conn
          |> put_view(DisposocialWeb.ChangesetView)
          |> render("error.json", changeset: remove_hash_errors(chgset))
        _ -> Logger.debug("SDSDSDDSDSDSDSDSD")
      end
    else
      send_resp(conn, 409, Jason.encode!(%{error: %{email: ["That account already exists"]}}))
    end
  end

  def show(conn, %{"id" => id}) do
    user = Users.get_user!(id)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Users.get_user!(id)

    with {:ok, %User{} = user} <- Users.update_user(user, user_params) do
      render(conn, "show.json", user: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Users.get_user!(id)

    with {:ok, %User{}} <- Users.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end
end
