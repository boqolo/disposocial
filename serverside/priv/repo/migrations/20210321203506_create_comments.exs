defmodule Disposocial.Repo.Migrations.CreateComments do
  use Ecto.Migration

  def change do
    create table(:comments) do
      add(:body, :text, null: false)
      add(:score, :integer, null: false, default: 0)
      add(:user_id, references(:users, on_delete: :nothing), null: false)
      add(:post_id, references(:posts, on_delete: :nothing), null: false)

      timestamps(type: :utc_datetime)
    end

    create(index(:comments, [:user_id]))
    create(index(:comments, [:post_id]))
  end
end
