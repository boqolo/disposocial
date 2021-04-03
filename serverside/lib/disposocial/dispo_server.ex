defmodule Disposocial.DispoServer do
  use GenServer

  require Logger
  alias Disposocial.{Dispos, Posts, DispoAgent, DispoRegistry, DispoSupervisor}

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

  # def broadcast_feed(id) do
  #   GenServer.cast(registry(id), :broadcast_feed)
  # end

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

  # @impl true
  # def handle_cast(:broadcast_feed, state) do
  #   # TODO broadcast on channel topic (dispo)
  #   {:noreply, state}
  # end

  @impl true
  def handle_info(:death, state) do
    # TODO self destruct stuff
    id = state.id
    Dispos.delete_dispo(state)
    # Goodbye
    Process.exit(self(), :normal)
    {:noreply, id}
  end

  @impl true
  def terminate(:normal, state) do
    # The final stand. Gets invoked when the server is about to exit
    Logger.info("DispoServer exiting with state #{inspect(state)}")
  end

end
