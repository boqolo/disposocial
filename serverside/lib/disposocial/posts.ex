defmodule Disposocial.Posts do
  @moduledoc """
  The Posts context.
  """

  require Logger

  import Ecto.Query, warn: false
  alias Disposocial.Repo

  alias Disposocial.Posts.Post
  alias Disposocial.Users
  alias Disposocial.Reactions
  alias Disposocial.Comments
  alias Disposocial.Comments.Comment
  alias Disposocial.Photos

  @doc """
  Returns the list of posts.

  ## Examples

      iex> list_posts()
      [%Post{}, ...]

  """
  def list_posts do
    Repo.all(Post)
  end

  def get_post(dispo_id, post_id) do
    Repo.get_by(Post, [dispo_id: dispo_id, id: post_id])
    |> load_reaction_count()
    |> present()
    |> load_comments()
  end

  def get_posts(dispo_id, post_ids) do
    q = from(p in Post, where: p.dispo_id == ^dispo_id and p.id in ^post_ids)
    Repo.all(q)
    |> Enum.map(fn post -> present(load_interactions(post)) end)
  end

  def load_comments(post) do
    Map.put(post, :comments, Comments.get_post_comments(post.id))
  end

  def load_interactions(post) do
    count = get_interaction_count(post.id)
    Map.put(post, :interactions, count)
  end

  def recent_posts(id) do
    # Subquery based on example here: https://hexdocs.pm/ecto/Ecto.Query.html#preload/3
    q = from(p in Post, where: p.dispo_id == ^id, limit: 10, order_by: [desc: p.inserted_at], preload: [:reactions])

    posts = Repo.all(q)
    post_ids = Enum.map(posts, fn p -> p.id end)
    Enum.zip(post_ids, Enum.map(posts, fn p -> present(p) end))
    |> Enum.into(%{}, fn {k, v} -> {k, v} end)
  end

  def recent_post_ids(dispo_id) do
    q = from(p in Post, where: p.dispo_id == ^dispo_id, limit: 10, order_by: [desc: p.inserted_at], select: p.id)
    Repo.all(q)
  end

  def get_reaction_counts(post_id) do
    # return %{likes: N, dislikes: N}
    reactions = Reactions.get_post_reactions(post_id)
    reducer =
      fn reac, acc ->
        case reac.value do
          1 -> %{acc | likes: acc.likes + 1}
          -1 -> %{acc | dislikes: acc.dislikes + 1}
          _ -> acc
        end
      end
    Enum.reduce(reactions, %{likes: 0, dislikes: 0}, reducer)
  end

  def load_reaction_count(post) do
    Map.put(post, :reaction_count, get_reaction_counts(post.id))
  end

  @doc """
  Gets a single post.

  Raises `Ecto.NoResultsError` if the Post does not exist.

  ## Examples

      iex> get_post!(123)
      %Post{}

      iex> get_post!(456)
      ** (Ecto.NoResultsError)

  """
  def get_post!(id), do: Repo.get!(Post, id)

  def get_most_popular(dispo_id) do
    # TODO https://github.com/NatTuck/scratch-2021-01/blob/master/4550/0309/photo_blog/lib/photo_blog/votes.ex
    # q = from(p in Post, where: p.dispo_id == ^dispo_id, limit: 10, order_by: [desc: ])
  end

  def get_interaction_count(post_id) do
    # interaction count = num comments + num reactions
    Reactions.get_num_reactions(post_id) + Comments.get_num_comments(post_id)
  end

  @doc """
  Creates a post.

  ## Examples

      iex> create_post(%{field: value})
      {:ok, %Post{}}

      iex> create_post(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_post(attrs \\ %{}) do
    attrs =
      if path = attrs[:upload] do
        case Photos.savePhoto("test", path) do
          {:ok, hash} -> Map.put(attrs, :media_hash, hash)
          _ ->
          Logger.error("PHOTO FAILED TO SAVE")
          attrs
        end
      else
        attrs
      end
    %Post{}
    |> Post.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a post.

  ## Examples

      iex> update_post(post, %{field: new_value})
      {:ok, %Post{}}

      iex> update_post(post, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_post(%Post{} = post, attrs) do
    post
    |> Post.changeset(attrs)
    |> Repo.update()
  end

  def present(post) do
    Map.take(post, [:id, :body, :media_hash, :user, :inserted_at, :interactions, :reaction_count])
    |> Map.put(:user, Users.present(post.user_id))
  end

  @doc """
  Deletes a post.

  ## Examples

      iex> delete_post(post)
      {:ok, %Post{}}

      iex> delete_post(post)
      {:error, %Ecto.Changeset{}}

  """
  def delete_post(%Post{} = post) do
    media_hash = post.media_hash
    unless media_hash == "" do
      # Delete the associated upload also
      File.rm_rf!(Photos.basePath(media_hash))
      Repo.delete(post)
    else
      Repo.delete(post)
    end
  end

  def delete_posts_and_remnants(dispo_id) do
    q = from(p in Post, where: p.dispo_id == ^dispo_id)
    post_ids = Repo.all(from(p in Post, where: p.dispo_id == ^dispo_id, select: p.id))
    hashes = Repo.all(from(p in Post, where: p.dispo_id == ^dispo_id, select: p.media_hash))

    with(
      {:ok, num_comm_deleted} <- Comments.delete_comments_and_remnants(post_ids),
      {num_reac_deleted, _} <- Reactions.delete_post_reactions(post_ids),
      {:ok, num_uploads_deleted} <- Photos.delete_uploads(hashes),
      {num_post_deleted, _} <- Repo.delete_all(q)) do
        {:ok, num_post_deleted, num_uploads_deleted, num_comm_deleted, num_reac_deleted}
    else
      _ -> Logger.alert("Delete posts failed")
    end
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking post changes.

  ## Examples

      iex> change_post(post)
      %Ecto.Changeset{data: %Post{}}

  """
  def change_post(%Post{} = post, attrs \\ %{}) do
    Post.changeset(post, attrs)
  end
end
