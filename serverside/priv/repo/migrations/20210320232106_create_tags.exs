defmodule Disposocial.Repo.Migrations.CreateTags do
  use Ecto.Migration

  def change do
    create table(:tags) do
      add(:name, :string, null: false)
      add(:dispo_id, references(:dispos, on_delete: :delete_all), null: false)

      timestamps()
    end
  end
end
