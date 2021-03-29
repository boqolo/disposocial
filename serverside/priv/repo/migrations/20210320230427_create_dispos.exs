defmodule Disposocial.Repo.Migrations.CreateDispos do
  use Ecto.Migration

  def change do
    create table(:dispos) do
      add(:name, :string, null: false)
      add(:location, :string, null: false)
      add(:latitude, :integer, null: false)
      add(:longitude, :integer, null: false)
      add(:death, :utc_datetime, null: false)
      add(:is_public, :boolean, null: false, default: true)
      add(:passcode_hash, :string, null: false, default: "")

      timestamps()
    end
  end
end
