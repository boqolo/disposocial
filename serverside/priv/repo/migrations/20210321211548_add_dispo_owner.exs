defmodule Disposocial.Repo.Migrations.AddDispoOwner do
  use Ecto.Migration

  def change do
    # Can't avoid doing this because they depend on each other
    # so need to pick a creation order
    alter table(:dispos) do
      # add(:creator_id, references(:users), null: false)
      add(:user_id, references(:users), null: false)
    end
  end
end
