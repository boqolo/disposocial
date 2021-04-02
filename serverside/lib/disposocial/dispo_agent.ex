defmodule Disposocial.DispoAgent do
  use Agent

  # This Agent is going to be used to hold more
  # persistent Dispo state and will be ready to
  # provide if the server process goes down

  # It is a map from DispoId --> DispoState

  # alias Disposocial.Dispos

  def start_link(_opts) do # NOTE can make take arg
    Agent.start_link(fn() -> %{} end, name: __MODULE__)
  end

  def get(id) do
    Agent.get(__MODULE__, fn(state) -> Map.get(state, id) end)
  end

  def put(id, dispo) do
    Agent.update(__MODULE__, fn(state) -> Map.put(state, id, dispo) end)
  end

end
