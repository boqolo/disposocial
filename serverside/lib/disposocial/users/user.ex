defmodule Disposocial.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field(:name, :string)
    field(:email, :string)
    field(:status, :string)
    field(:passcode_hash, :string)
    field(:photo_hash, :string)

    has_one(:dispo, :id)
    has_many(:posts, Disposocial.Posts.Post)

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :passcode_hash, :dispo_id, :photo_hash, :status, :email])
    |> validate_required([:name, :passcode_hash, :dispo_id, :photo_hash, :status, :email])
  end
end
