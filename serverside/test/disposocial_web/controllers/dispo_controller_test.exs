defmodule DisposocialWeb.DispoControllerTest do
  use DisposocialWeb.ConnCase

  alias Disposocial.Dispos
  alias Disposocial.Dispos.Dispo

  @create_attrs %{
    death: "2010-04-17T14:00:00Z",
    location: "some location",
    name: "some name"
  }
  @update_attrs %{
    death: "2011-05-18T15:01:01Z",
    location: "some updated location",
    name: "some updated name"
  }
  @invalid_attrs %{death: nil, location: nil, name: nil}

  def fixture(:dispo) do
    {:ok, dispo} = Dispos.create_dispo(@create_attrs)
    dispo
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all dispos", %{conn: conn} do
      conn = get(conn, Routes.dispo_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create dispo" do
    test "renders dispo when data is valid", %{conn: conn} do
      conn = post(conn, Routes.dispo_path(conn, :create), dispo: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.dispo_path(conn, :show, id))

      assert %{
               "id" => id,
               "death" => "2010-04-17T14:00:00Z",
               "location" => "some location",
               "name" => "some name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.dispo_path(conn, :create), dispo: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update dispo" do
    setup [:create_dispo]

    test "renders dispo when data is valid", %{conn: conn, dispo: %Dispo{id: id} = dispo} do
      conn = put(conn, Routes.dispo_path(conn, :update, dispo), dispo: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.dispo_path(conn, :show, id))

      assert %{
               "id" => id,
               "death" => "2011-05-18T15:01:01Z",
               "location" => "some updated location",
               "name" => "some updated name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, dispo: dispo} do
      conn = put(conn, Routes.dispo_path(conn, :update, dispo), dispo: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete dispo" do
    setup [:create_dispo]

    test "deletes chosen dispo", %{conn: conn, dispo: dispo} do
      conn = delete(conn, Routes.dispo_path(conn, :delete, dispo))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.dispo_path(conn, :show, dispo))
      end
    end
  end

  defp create_dispo(_) do
    dispo = fixture(:dispo)
    %{dispo: dispo}
  end
end
