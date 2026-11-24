import '../../storage/adapters/in_memory_storage.dart';
import '../../storage/game_storage.dart';

GameStorage createPlatformStorageImpl() => InMemoryGameStorage();
