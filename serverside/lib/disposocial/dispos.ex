defmodule Disposocial.Dispos do
  @moduledoc """
  The Dispos context.
  """

  import Ecto.Query, warn: false
  alias Disposocial.Repo

  alias Disposocial.Dispos.Dispo

  @doc """
  Returns the list of dispos.

  ## Examples

      iex> list_dispos()
      [%Dispo{}, ...]

  """
  def list_dispos do
    Repo.all(Dispo)
  end

  @doc """
  Gets a single dispo.

  Raises `Ecto.NoResultsError` if the Dispo does not exist.

  ## Examples

      iex> get_dispo!(123)
      %Dispo{}

      iex> get_dispo!(456)
      ** (Ecto.NoResultsError)

  """
  def get_dispo!(id), do: Repo.get!(Dispo, id)

  @doc """
  Creates a dispo.

  ## Examples

      iex> create_dispo(%{field: value})
      {:ok, %Dispo{}}

      iex> create_dispo(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_dispo(attrs \\ %{}) do
    %Dispo{}
    |> Dispo.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a dispo.

  ## Examples

      iex> update_dispo(dispo, %{field: new_value})
      {:ok, %Dispo{}}

      iex> update_dispo(dispo, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_dispo(%Dispo{} = dispo, attrs) do
    dispo
    |> Dispo.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a dispo.

  ## Examples

      iex> delete_dispo(dispo)
      {:ok, %Dispo{}}

      iex> delete_dispo(dispo)
      {:error, %Ecto.Changeset{}}

  """
  def delete_dispo(%Dispo{} = dispo) do
    Repo.delete(dispo)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking dispo changes.

  ## Examples

      iex> change_dispo(dispo)
      %Ecto.Changeset{data: %Dispo{}}

  """
  def change_dispo(%Dispo{} = dispo, attrs \\ %{}) do
    Dispo.changeset(dispo, attrs)
  end
end
