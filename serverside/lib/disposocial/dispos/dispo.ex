defmodule Disposocial.Dispos.Dispo do
  use Ecto.Schema
  import Ecto.Changeset

  schema "dispos" do
    field(:death, :utc_datetime)
    field(:latitude, :float)
    field(:longitude, :float)
    field(:location, :map)
    field(:name, :string)
    field(:is_public, :boolean)
    field(:password_hash, :string)

    belongs_to(:user, Disposocial.Users.User) # creator
    has_many(:users, Disposocial.Users.User) # TODO remove??
    has_many(:posts, Disposocial.Posts.Post)

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(dispo, attrs) do
    dispo
    |> cast(attrs, [:name, :location, :latitude, :longitude, :is_public, :password_hash, :death, :user_id])
    |> validate_required([:name, :latitude, :is_public, :longitude, :death, :user_id])
    |> validate_length(:name, min: 4, max: 20)
  end
end
