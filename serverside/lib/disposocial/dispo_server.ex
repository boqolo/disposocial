defmodule Disposocial.DispoServer do
  use GenServer

  require Logger
  alias Disposocial.{Dispos, DispoAgent, DispoRegistry, DispoSupervisor}

  def registry(id) do
    {:via, Registry, {DispoRegistry, id}}
  end

  # API

  def start(id) do
    # Start a new DispoServer Process and get it supervised
    spec = %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, [id]},
      restart: :transient,
      type: :worker
    }
    DispoSupervisor.start_child(spec)
  end

  # Callbacks

  def start_link(id) do
    # Starts the Process instance and calls init
    GenServer.start_link(__MODULE__, id, name: registry(id))
  end

  @impl true
  def init(id) do
    # REQUIRED: This is invoked when the GenServer process is started and is
    # called by `start_link`. Blocking until it returns.
    dispo =
      if prevState = DispoAgent.get(id) do
        prevState
      else
        DispoAgent.put(id, Dispos.get_dispo!(id))
        DispoAgent.get(id)
      end

    # send self destruct message in on death date in the future
    # NOTE problem if ms too large?? ex. death a week from now
    ms_from_now = DateTime.diff(dispo.death, DateTime.utc_now(), :millisecond)
    Process.send_after(self(), :death, ms_from_now)

    Logger.info("Dispo Server started: id --> #{inspect(id)}, pid --> #{inspect(self())}")
    {:ok, dispo}
  end

  @impl true
  def handle_info(:death, state) do
    # TODO self destruct stuff
    Dispos.delete_dispo(state)
  end

end
