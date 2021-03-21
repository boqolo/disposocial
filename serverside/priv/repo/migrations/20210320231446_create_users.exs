defmodule Disposocial.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :name, :string
      add :password_hash, :string
      add :photo_hash, :string
      add :dispo_id, references(:dispos, on_delete: :nothing)

      timestamps()
    end

    create index(:users, [:dispo_id])
  end
end
