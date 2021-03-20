defmodule Disposocial.RandomWords do
  use GenServer

  @words_path Path.expand("~/.disposocial_words")
  @adj_file Path.join(@words_path, "adjectives.txt")
  @noun_file Path.join(@words_path, "nouns.txt")

  def start_link(state \\ %{}) do
    GenServer.start_link(__MODULE__, state, name: __MODULE__)
  end

  def init(_state), do: {:ok, init_words()}

  defp init_words do
    adjs = String.split(File.read!(@adj_file), ~r{\s}, trim: true)
    nouns = String.split(File.read!(@noun_file), ~r{\s}, trim: true)
    %{new: %{adjs: adjs, nouns: nouns}, old: %{adjs: [], nouns: []}}
  end

  # Client

  def get_dispo_id, do: GenServer.call(__MODULE__, :get_dispo_id)

  # API

  def handle_call(:get_dispo_id, _from, state) do
    # get new adj + noun, add them to old, remove from new, reply, loop
    {adj, newAdjs, oldAdjs} = get_adj(state.new.adjs, state.old.adjs)
    {noun, newNouns, oldNouns} = get_noun(state.new.nouns, state.old.nouns)

    newState =
      state
      |> Map.put(:new, %{adjs: newAdjs, nouns: newNouns})
      |> Map.put(:old, %{adjs: oldAdjs, nouns: oldNouns})

    {:reply, "#{adj}-#{noun}", newState}
  end

  defp get_adj(newAdjs, oldAdjs) do
    unless Enum.count(newAdjs) < 1 do
      adj = Enum.random(newAdjs)
      delAdjs = List.delete(newAdjs, adj)
      updOldAdjs = [adj | oldAdjs]
      {adj, delAdjs, updOldAdjs}
    else
      adj = Enum.random(oldAdjs)
      delAdjs = List.delete(oldAdjs, adj)
      updOldAdjs = [adj | newAdjs]
      {adj, delAdjs, updOldAdjs}
    end
  end

  defp get_noun(newNouns, oldNouns) do
    unless Enum.count(newNouns) < 1 do
      noun = Enum.random(newNouns)
      delNouns = List.delete(newNouns, noun)
      updOldNouns = [noun | oldNouns]
      {noun, delNouns, updOldNouns}
    else
      noun = Enum.random(oldNouns)
      delNouns = List.delete(oldNouns, noun)
      updOldNouns = [noun | newNouns]
      {noun, delNouns, updOldNouns}
    end
  end
end
