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

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :password_hash, :photo_hash, :status, :email])
    |> validate_required([:name, :password_hash, :email])
  end
end
