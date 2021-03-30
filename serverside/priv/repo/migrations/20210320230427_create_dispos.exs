defmodule Disposocial.Repo.Migrations.CreateDispos do
  use Ecto.Migration

  def change do
    create table(:dispos) do
      add(:name, :string, null: false)
      add(:location, :map, null: false)
      add(:latitude, :float, null: false)
      add(:longitude, :float, null: false)
      add(:death, :utc_datetime, null: false)
      add(:is_public, :boolean, null: false, default: true)
      add(:password_hash, :string, null: false, default: "")

      timestamps(type: :utc_datetime)
    end
  end
end
