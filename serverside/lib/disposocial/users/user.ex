defmodule Disposocial.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field(:name, :string)
    field(:email, :string)
    field(:status, :string)
    field(:password_hash, :string)
    field(:photo_hash, :string)

    has_many(:posts, Disposocial.Posts.Post)
    has_many(:dispos, Disposocial.Dispos.Dispo)

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :password_hash, :photo_hash, :status, :email])
    |> validate_required([:name, :password_hash, :email])
    |> validate_length(:name, min: 2, max: 15)
    |> validate_length(:email, min: 6, max: 20)
    |> validate_format(:email, ~r/.+@.+\..+/)
  end
end
