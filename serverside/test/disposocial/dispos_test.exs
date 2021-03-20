defmodule Disposocial.DisposTest do
  use Disposocial.DataCase

  alias Disposocial.Dispos

  describe "dispos" do
    alias Disposocial.Dispos.Dispo

    @valid_attrs %{death: "2010-04-17T14:00:00Z", location: "some location", name: "some name"}
    @update_attrs %{death: "2011-05-18T15:01:01Z", location: "some updated location", name: "some updated name"}
    @invalid_attrs %{death: nil, location: nil, name: nil}

    def dispo_fixture(attrs \\ %{}) do
      {:ok, dispo} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Dispos.create_dispo()

      dispo
    end

    test "list_dispos/0 returns all dispos" do
      dispo = dispo_fixture()
      assert Dispos.list_dispos() == [dispo]
    end

    test "get_dispo!/1 returns the dispo with given id" do
      dispo = dispo_fixture()
      assert Dispos.get_dispo!(dispo.id) == dispo
    end

    test "create_dispo/1 with valid data creates a dispo" do
      assert {:ok, %Dispo{} = dispo} = Dispos.create_dispo(@valid_attrs)
      assert dispo.death == DateTime.from_naive!(~N[2010-04-17T14:00:00Z], "Etc/UTC")
      assert dispo.location == "some location"
      assert dispo.name == "some name"
    end

    test "create_dispo/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Dispos.create_dispo(@invalid_attrs)
    end

    test "update_dispo/2 with valid data updates the dispo" do
      dispo = dispo_fixture()
      assert {:ok, %Dispo{} = dispo} = Dispos.update_dispo(dispo, @update_attrs)
      assert dispo.death == DateTime.from_naive!(~N[2011-05-18T15:01:01Z], "Etc/UTC")
      assert dispo.location == "some updated location"
      assert dispo.name == "some updated name"
    end

    test "update_dispo/2 with invalid data returns error changeset" do
      dispo = dispo_fixture()
      assert {:error, %Ecto.Changeset{}} = Dispos.update_dispo(dispo, @invalid_attrs)
      assert dispo == Dispos.get_dispo!(dispo.id)
    end

    test "delete_dispo/1 deletes the dispo" do
      dispo = dispo_fixture()
      assert {:ok, %Dispo{}} = Dispos.delete_dispo(dispo)
      assert_raise Ecto.NoResultsError, fn -> Dispos.get_dispo!(dispo.id) end
    end

    test "change_dispo/1 returns a dispo changeset" do
      dispo = dispo_fixture()
      assert %Ecto.Changeset{} = Dispos.change_dispo(dispo)
    end
  end
end
