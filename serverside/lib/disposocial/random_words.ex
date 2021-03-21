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
    {adj, newAdjs, oldAdjs} = get_word(state.new.adjs, state.old.adjs)
    {noun, newNouns, oldNouns} = get_word(state.new.nouns, state.old.nouns)

    newState =
      state
      |> Map.put(:new, %{adjs: newAdjs, nouns: newNouns})
      |> Map.put(:old, %{adjs: oldAdjs, nouns: oldNouns})

    {:reply, "#{adj}-#{noun}", newState}
  end

  defp get_word(newWords, oldWords) do
    unless Enum.count(newWords) < 1 do
      word = Enum.random(newWords)
      delWords = List.delete(newWords, word)
      updOldWords = [word | oldWords]
      {word, delWords, updOldWords}
    else
      word = Enum.random(oldWords)
      delWords = List.delete(oldWords, word)
      updOldWords = [word | newWords]
      {word, delWords, updOldWords}
    end
  end
end
