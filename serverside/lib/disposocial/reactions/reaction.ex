defmodule Disposocial.Reactions.Reaction do
  use Ecto.Schema
  import Ecto.Changeset

  schema "reactions" do
    field :value, :integer
    field :post_id, :id
    field :user_id, :id

    timestamps()
  end

  @doc false
  def changeset(reaction, attrs) do
    reaction
    |> cast(attrs, [:value])
    |> validate_required([:value])
  end
end
