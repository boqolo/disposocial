defmodule DisposocialWeb.RootController do
  use DisposocialWeb, :controller

  plug Disposocial.Plugs.RequireAPIAuth when action not in [:retrieve]

  require Logger
  alias Disposocial.Photos

  def retrieve(conn, %{"hash" => hash}) do
    Logger.debug("GOT HASH --> #{inspect(hash)}")
    case Photos.retrievePhoto(hash) do
      {:ok, _metadata, data} ->
        conn
        |> put_resp_content_type("image/jpeg")
        |> send_resp(200, data)
      {:error, msg} -> send_resp(conn, 404, Jason.encode!(%{error: [msg]}))
    end
  end

  def upload(conn, %{"media" => %{"file" => file}}) do
    case Photos.savePhoto(file.filename, file.path) do
      {:ok, hash} ->
        conn
        |> put_resp_header("Content-Type", "application/json")
        |> send_resp(201, Jason.encode!(%{media_hash: hash}))
      {:error, msg} -> send_resp(conn, 413, Jason.encode!(%{error: [msg]}))
      _ -> send_resp(conn, 400, Jason.encode!(%{error: ["Upload failed"]}))
    end
  end

end
