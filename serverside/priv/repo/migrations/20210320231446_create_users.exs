defmodule Disposocial.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add(:name, :string, null: false)
      add(:email, :string, null: false)
      add(:status, :string, null: false, default: "offline")
      add(:password_hash, :string, null: false)
      add(:photo_hash, :string, null: false, default: "default")

      add(
        :dispo_id,
        references(:dispos, on_delete: :nothing)
      )

      timestamps(type: :utc_datetime)
    end

    create(index(:users, [:dispo_id]))
  end
end
