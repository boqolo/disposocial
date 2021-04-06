defmodule Disposocial.Reactions.Reaction do
  use Ecto.Schema
  import Ecto.Changeset

  schema "reactions" do
    field(:value, :integer)

    belongs_to(:user, Disposocial.Users.User)
    belongs_to(:post, Disposocial.Posts.Post)

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(reaction, attrs) do
    reaction
    |> cast(attrs, [:value, :user_id, :post_id])
    |> validate_required([:value, :user_id, :post_id])
    |> foreign_key_constraint(:post_id)
    |> foreign_key_constraint(:user_id)
  end
end
