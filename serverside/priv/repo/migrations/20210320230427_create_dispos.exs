defmodule Disposocial.Repo.Migrations.CreateDispos do
  use Ecto.Migration

  def change do
    create table(:dispos) do
      add :name, :string
      add :location, :string
      add :death, :utc_datetime

      timestamps()
    end

  end
end
