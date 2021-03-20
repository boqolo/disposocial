defmodule Disposocial.Photos do
  @root Path.expand("~/.disposocial_uploads/photos")
  @default_photo Path.join(@root, "default/photo.jpg")

  require Logger

  # This module is interpolated from Nat Tuck lecture code here:
  # https://github.com/NatTuck/scratch-2021-01/blob/master/4550/0309/photo_blog/lib/photo_blog/photos.ex

  def sha256(data) do
    # create binary hash from data 
    # and convert to base64 string so we can store in 
    # the database
    # erlang crypto module here
    :crypto.hash(:sha256, data)
    |> Base.encode64(case: :lower)
  end

  def savePhoto(filename, path) do
    # key info: filename, data, hash, metadata
    data = File.read!(path)
    hash = sha256(data)
    metadata? = readMetadata(hash)

    metadata =
      unless metadata? do
        # create individ dir for every photo upload
        File.mkdir_p!(basePath(hash))
        Map.merge(%{"name" => filename, "refs" => 0}, getSomeStats(filename))
      else
        metadata?
      end

    savePhoto(filename, hash, data, metadata)
  end

  def getSomeStats(filename) do
    with {:ok, fileStat} <- File.stat(filename) do
      fileStat
      |> Map.from_struct()
      |> Map.take([:ctime, :size])
    else
      _ -> %{}
    end
  end

  def savePhoto(_filename, hash, data, metadata) do
    # have dir and all info
    metadata = Map.update!(metadata, "refs", fn count -> count + 1 end)
    # write file to photo loc + write metadata
    File.write!(dataPath(hash), data)
    File.write!(metaPath(hash), Jason.encode!(metadata))
    Logger.debug("PHOTO SAVED SUCCESSFULLY AT ---> #{dataPath(hash)}")
    {:ok, hash}
  end

  def deletePhoto(hash) do
    File.rm_rf!(basePath(hash))
    :ok
  end

  def retrievePhoto(hash) do
    data = File.read!(dataPath(hash))

    metadata =
      File.read!(metaPath(hash))
      |> Jason.decode!()

    {:ok, metadata, data}
  end

  def retrieveDefaultPhoto() do
    data = File.read!(@default_photo)
    {:ok, data}
  end

  def readMetadata(hash) do
    # This is a special form that will execute the 
    # `do` *with* the bindings if they match
    with {:ok, data} <- File.read(metaPath(hash)),
         {:ok, metadata} <- Jason.decode(data) do
      metadata
    else
      _ -> nil
    end
  end

  def basePath(hash) do
    Path.expand(@root)
    |> Path.join(hash)
  end

  def metaPath(hash) do
    basePath(hash)
    |> Path.join("meta.json")
  end

  def dataPath(hash) do
    basePath(hash)
    |> Path.join("photo.jpg")
  end
end
