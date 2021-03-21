defmodule Disposocial.Dispos.Dispo do
  use Ecto.Schema
  import Ecto.Changeset

  schema "dispos" do
    field(:death, :utc_datetime)
    field(:location, :string)
    field(:name, :string)
    field(:is_public, :boolean)
    field(:passcode_hash, :string)

    has_one(:creator, Disposocial.Users.User)
    has_many(:users, Disposocial.Users.User)
    has_many(:posts, Disposocial.Posts.Post)

    timestamps()
  end

  @doc false
  def changeset(dispo, attrs) do
    dispo
    |> cast(attrs, [:name, :location, :is_public, :passcode_hash, :death, :creator_id])
    |> validate_required([:name, :location, :death])
  end
end
