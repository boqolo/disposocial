defmodule DisposocialWeb.DispoController do
  use DisposocialWeb, :controller

  plug Disposocial.Plugs.RequireAPIAuth when action not in [:get_near]

  alias Disposocial.Dispos
  alias Disposocial.Dispos.Dispo
  alias Disposocial.Util

  action_fallback DisposocialWeb.FallbackController

  def get_near(conn, %{"lat" => lat, "lng" => lng}) do
    unless is_float(lat) && is_float(lng) do
      # TODO return error
      render(conn, "one_error.json", msgs: ["Malformed data"])
    else
      # perform lookup and return results
      dispos = Dispos.get_all_near(lat, lng)
      render(conn, "index.json", dispos: dispos)
    end
  end

  def index(conn, _params) do
    dispos = Dispos.list_dispos()
    render(conn, "index.json", dispos: dispos)
  end

  # TODO santize input
  def create(conn, %{"dispo" => dispo_params}) do
    with {:ok, %Dispo{} = dispo} <- Dispos.create_dispo(dispo_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.dispo_path(conn, :show, dispo))
      |> render("show.json", dispo: dispo)
    end
  end

  def show(conn, %{"id" => id}) do
    dispo = Dispos.get_dispo!(id)
    render(conn, "show.json", dispo: dispo)
  end

  def update(conn, %{"id" => id, "dispo" => dispo_params}) do
    dispo = Dispos.get_dispo!(id)

    with {:ok, %Dispo{} = dispo} <- Dispos.update_dispo(dispo, dispo_params) do
      render(conn, "show.json", dispo: dispo)
    end
  end

  def delete(conn, %{"id" => id}) do
    dispo = Dispos.get_dispo!(id)

    with {:ok, %Dispo{}} <- Dispos.delete_dispo(dispo) do
      send_resp(conn, :no_content, "")
    end
  end
end
