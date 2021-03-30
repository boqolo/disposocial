defmodule Disposocial.Repo.Migrations.CreateReactions do
  use Ecto.Migration

  def change do
    create table(:reactions) do
      add(:value, :integer, null: false)
      add(:user_id, references(:users, on_delete: :nothing), null: false)
      add(:post_id, references(:posts, on_delete: :delete_all), null: false)

      timestamps(type: :utc_datetime)
    end

    create(index(:reactions, [:post_id]))
    create(index(:reactions, [:user_id]))
  end
end
