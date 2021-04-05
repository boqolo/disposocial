defmodule Disposocial.Comments.Comment do
  use Ecto.Schema
  import Ecto.Changeset

  schema "comments" do
    field(:body, :string)
    field(:score, :integer)

    belongs_to(:user, Disposocial.Users.User)
    belongs_to(:post, Disposocial.Posts.Post)

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(comment, attrs) do
    comment
    |> cast(attrs, [:body, :score, :user_id, :post_id])
    |> validate_required([:body, :user_id, :post_id])
    |> validate_length(:body, min: 1)
  end
end
