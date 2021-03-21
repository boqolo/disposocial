defmodule Disposocial.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :name, :string
    field :password_hash, :string
    field :photo_hash, :string
    field :dispo_id, :id

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :password_hash, :photo_hash])
    |> validate_required([:name, :password_hash, :photo_hash])
  end
end
