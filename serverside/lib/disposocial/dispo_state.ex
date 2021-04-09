defmodule Disposocial.DispoState do
  @min_popular 10

  alias Disposocial.{Dispos, Users}

  defp clean(dispo) do
    creator = Users.present(dispo.user.id)
    relevant = [
      :id,
      :name,
      :death,
      :latitude,
      :longitude,
      :is_public,
      :inserted_at,
      :location
    ]
    dispo
    |> Map.take(relevant)
    |> Map.put(:creator, creator)
  end

  def new(id) do
    # FIXME this is crashing
    Dispos.get_dispo!(id)
    |> Dispos.load_creator()
    |> clean()
    |> Map.put(:popular, %{})
  end

  @doc"""
  Calculates if the given post is deserving of being cached as
  a popular one. Returns a state
  """
  def compute_popular(post_id, num_inter, state) do
    # TODO Someday turn this into a db query
    if Enum.count(state.popular) < @min_popular do
      new_pop = Map.put(state.popular, post_id, num_inter)
      %{state | popular: new_pop}
    else
      # replace if exceeds a popular post
      exceeds? =
        Enum.find(
          Map.keys(state.popular),
          fn p_id -> num_inter > state.popular[p_id] end
        )
      new_pop =
        if exceeds? do
          state.popular
          |> Map.drop(exceeds?)
          |> Map.put(post_id, num_inter)
        else
          state.popular
        end
      %{state | popular: new_pop}
    end
  end

end
