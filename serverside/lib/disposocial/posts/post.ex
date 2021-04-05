defmodule Disposocial.Posts.Post do
  use Ecto.Schema
  import Ecto.Changeset

  schema "posts" do
    field(:body, :string)
    field(:media_hash, :string)

    belongs_to(:user, Disposocial.Users.User)
    belongs_to(:dispo, Disposocial.Dispos.Dispo)
    has_many(:reactions, Disposocial.Reactions.Reaction)
    many_to_many(:tags, Disposocial.Tags.Tag, join_through: "posts-tags")

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(post, attrs) do
    post
    |> cast(attrs, [:body, :media_hash, :user_id, :dispo_id])
    |> validate_required([:body, :user_id, :dispo_id])
    |> validate_length(:body, min: 1)
  end
end
