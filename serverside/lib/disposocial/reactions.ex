defmodule Disposocial.Reactions do
  @moduledoc """
  The Reactions context.
  """

  import Ecto.Query, warn: false
  alias Disposocial.Repo

  alias Disposocial.Reactions.Reaction

  @doc """
  Returns the list of reactions.

  ## Examples

      iex> list_reactions()
      [%Reaction{}, ...]

  """
  def list_reactions do
    Repo.all(Reaction)
  end

  def get_num_reactions(post_id) do
    q = from r in Reaction, where: r.post_id == ^post_id
    Repo.aggregate(q, :count)
  end

  @doc """
  Gets a single reaction.

  Raises `Ecto.NoResultsError` if the Reaction does not exist.

  ## Examples

      iex> get_reaction!(123)
      %Reaction{}

      iex> get_reaction!(456)
      ** (Ecto.NoResultsError)

  """
  def get_reaction!(id), do: Repo.get!(Reaction, id)

  def get_post_reaction(post_id, user_id) do
    Repo.get_by!(Reaction, [post_id: post_id, user_id: user_id])
  end

  @doc """
  Creates a reaction.

  ## Examples

      iex> create_reaction(%{field: value})
      {:ok, %Reaction{}}

      iex> create_reaction(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_reaction(attrs \\ %{}) do
    %Reaction{}
    |> Reaction.changeset(attrs)
    |> Repo.insert()
  end

  def create_or_update_reaction(attrs) do
    # create if doesn't exist else update
    unless exists?(attrs) do
      create_reaction(attrs)
      {:ok, :created}
    else
      reaction = get_post_reaction(attrs.post_id, attrs.user_id)
      if reaction.value == attrs.value do
        :noop
      else
        update_reaction(reaction, attrs)
        {:ok, :updated}
      end
    end
  end

  defp exists?(attrs) do
    q = from r in Reaction, where: r.post_id == ^attrs.post_id and r.user_id == ^attrs.user_id
    Repo.exists?(q)
  end

  def get_post_reactions(post_id) do
    q = from(r in Reaction, where: r.post_id == ^post_id)
    Repo.all(q)
  end

  @doc """
  Updates a reaction.

  ## Examples

      iex> update_reaction(reaction, %{field: new_value})
      {:ok, %Reaction{}}

      iex> update_reaction(reaction, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_reaction(%Reaction{} = reaction, attrs) do
    reaction
    |> Reaction.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a reaction.

  ## Examples

      iex> delete_reaction(reaction)
      {:ok, %Reaction{}}

      iex> delete_reaction(reaction)
      {:error, %Ecto.Changeset{}}

  """
  def delete_reaction(%Reaction{} = reaction) do
    Repo.delete(reaction)
  end

  def delete_post_reactions(post_ids) do
    q = from(r in Reaction, where: r.post_id in ^post_ids)
    Repo.delete_all(q)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking reaction changes.

  ## Examples

      iex> change_reaction(reaction)
      %Ecto.Changeset{data: %Reaction{}}

  """
  def change_reaction(%Reaction{} = reaction, attrs \\ %{}) do
    Reaction.changeset(reaction, attrs)
  end
end
