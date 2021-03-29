defmodule Disposocial.Users do
  @moduledoc """
  The Users context.
  """

  import Ecto.Query, warn: false
  alias Disposocial.Repo

  alias Disposocial.Users.User

  require Logger

  @doc """
  Returns the list of users.

  ## Examples

      iex> list_users()
      [%User{}, ...]

  """
  def list_users do
    Repo.all(User)
  end

  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user!(id), do: Repo.get!(User, id)

  @doc """
  Creates a user.

  ## Examples

      iex> create_user(%{field: value})
      {:ok, %User{}}

      iex> create_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user(attrs \\ %{}) do
    Logger.debug("CREATING USER WITH --> #{inspect(attrs)}")
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  def stringify_keys(amap) do
    for {k, v} <- amap, into: %{}, do: {to_string(k), v}
  end

  def create_user_with_passhash(%{"password" => password} = attrs) do
    attrs
    |> Map.merge(Argon2.add_hash(password))
    |> Map.drop(["password"])
    |>stringify_keys()
    |> create_user()
  end

  def authenticate(email, password) do
    # determine if username and password match
    user = Repo.get_by(User, email: email)
    if user && Argon2.verify_pass(password, user.password_hash) do
      {:ok, user}
    else
      nil
    end
  end

  @doc """
  Updates a user.

  ## Examples

      iex> update_user(user, %{field: new_value})
      {:ok, %User{}}

      iex> update_user(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a user.

  ## Examples

      iex> delete_user(user)
      {:ok, %User{}}

      iex> delete_user(user)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.

  ## Examples

      iex> change_user(user)
      %Ecto.Changeset{data: %User{}}

  """
  def change_user(%User{} = user, attrs \\ %{}) do
    User.changeset(user, attrs)
  end
end
