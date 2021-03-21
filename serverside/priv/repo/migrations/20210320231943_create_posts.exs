defmodule Disposocial.Repo.Migrations.CreatePosts do
  use Ecto.Migration

  def change do
    create table(:posts) do
      add(:body, :text, null: false)
      add(:media_hash, :string, null: false, default: "")
      add(:user_id, references(:users, on_delete: :nothing), null: false)
      add(:dispo_id, references(:dispos, on_delete: :delete_all), null: false)

      timestamps()
    end

    create(index(:posts, [:user_id]))
    create(index(:posts, [:dispo_id]))
  end
end
