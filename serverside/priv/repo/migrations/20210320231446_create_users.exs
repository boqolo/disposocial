defmodule Disposocial.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add(:name, :string, null: false)
      add(:email, :string, null: false)
      add(:status, :string, null: false)
      add(:passcode_hash, :string, null: false)
      add(:photo_hash, :string, null: false)

      add(
        :dispo_id,
        references(:dispos, on_delete: :nothing),
        null: false
      )

      timestamps()
    end

    create(index(:users, [:dispo_id]))
  end
end
