defmodule DisposocialWeb.RootController do
  use DisposocialWeb, :controller

  plug Disposocial.Plugs.RequireAPIAuth

  alias Disposocial.Photos

  def photo(conn, %{"hash" => hash}) do
    {:ok, _metadata, data} = Photos.retrievePhoto(hash)

    conn
    |> put_resp_content_type("image/jpeg")
    |> send_resp(200, data)
  end
end
