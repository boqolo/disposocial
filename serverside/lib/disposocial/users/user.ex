defmodule Disposocial.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field(:name, :string)
    field(:email, :string)
    field(:status, :string)
    field(:password, :string, virtual: true)
    field(:password_hash, :string)
    field(:photo_hash, :string)

    has_many(:posts, Disposocial.Posts.Post)
    has_many(:dispos, Disposocial.Dispos.Dispo)

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :password, :password_hash, :photo_hash, :status, :email])
    |> validate_required([:name, :password, :email])
    |> validate_length(:name, min: 2, max: 25)
    |> validate_length(:email, min: 6, max: 30)
    |> validate_format(:email, ~r/.+@.+\..+/)
    |> validate_length(:password, min: 10)
    |> put_pass_hash()
    |> validate_required([:name, :password_hash, :email])
  end

  defp put_pass_hash(chgset) do
    %{changes: changes} = chgset
    password = Map.get(changes, :password)
    if password do
      changes =
        changes
        |> Map.merge(Argon2.add_hash(password))
      Map.put(chgset, :changes, changes)
    else
      chgset
    end
  end
end
