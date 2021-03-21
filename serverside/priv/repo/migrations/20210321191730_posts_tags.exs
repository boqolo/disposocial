defmodule Disposocial.Repo.Migrations.PostsTags do
  use Ecto.Migration

  def change do
    # Source: https://hexdocs.pm/ecto/Ecto.Schema.html#many_to_many/3-migration
    # https://hexdocs.pm/ecto/Ecto.Schema.html#many_to_many/3-examples
    # A join table is needed for the many to many relationship
    # of posts and tags. Without it, the tables could not 
    # intersect in a meaningful way. 
    create table(:posts_tags, primary_key: false) do
      add(:post_id, references(:posts), null: false)
      add(:tag_id, references(:tags), null: false)
    end
  end
end
