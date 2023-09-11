package edu.ucsb.cs156.example.repositories;

import edu.ucsb.cs156.example.entities.DatabaseEntry;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DatabaseEntryRepository extends CrudRepository<DatabaseEntry, Long> {
}
