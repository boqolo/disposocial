defmodule Disposocial.Dispos.Dispo do
  use Ecto.Schema
  import Ecto.Changeset

  schema "dispos" do
    field :death, :utc_datetime
    field :location, :string
    field :name, :string

    timestamps()
  end

  @doc false
  def changeset(dispo, attrs) do
    dispo
    |> cast(attrs, [:name, :location, :death])
    |> validate_required([:name, :location, :death])
  end
end
