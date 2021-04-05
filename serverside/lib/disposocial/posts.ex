defmodule Disposocial.Posts do
  @moduledoc """
  The Posts context.
  """

  import Ecto.Query, warn: false
  alias Disposocial.Repo

  alias Disposocial.Posts.Post
  alias Disposocial.Reactions
  alias Disposocial.Comments.Comment

  @doc """
  Returns the list of posts.

  ## Examples

      iex> list_posts()
      [%Post{}, ...]

  """
  def list_posts do
    Repo.all(Post)
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

  @doc """
  Creates a post.

  ## Examples

      iex> create_post(%{field: value})
      {:ok, %Post{}}

      iex> create_post(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_post(attrs \\ %{}) do
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
    post = Repo.preload(post, :user)
    username = post.user.name
    Map.take(post, [:id, :body, :media_hash, :user_id, :inserted_at])
    |> Map.put(:username, username)
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
    Repo.delete(post)
  end

  def delete_posts_and_remnants(dispo_id) do
    q = from(p in Post, where: p.dispo_id == ^dispo_id)
    post_ids = Repo.all(select(q, [:id]))
    case Repo.delete_all(q) do
      {:ok, _} ->
        # TODO Comments.delete_comments_and_remnants(post_ids)
        Reactions.delete_post_reactions(post_ids)
      error -> error
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
