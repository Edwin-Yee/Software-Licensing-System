package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.DatabaseEntry;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.DatabaseEntryRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import java.time.LocalDateTime;

@Tag(name = "DatabaseEntries")
@RequestMapping("/api/database_entries")
@RestController
public class DatabaseEntriesController extends ApiController {

    @Autowired
    DatabaseEntryRepository databaseEntryRepository;

    @Operation(summary = "List all database_entries")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<DatabaseEntry> allDatabaseEntries() {
        Iterable<DatabaseEntry> database_entries = databaseEntryRepository.findAll();
        return database_entries;
    }

    @Operation(summary = "Get a single database_entry")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public DatabaseEntry getById(
            @Parameter(name = "id") @RequestParam Long id) {
        DatabaseEntry database_entry = databaseEntryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(DatabaseEntry.class, id));

        return database_entry;
    }

    @Operation(summary = "Create a new database_entry")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public DatabaseEntry postDatabaseEntry(

            @Parameter(name = "name") @RequestParam String name,
            @Parameter(name = "email") @RequestParam String email, 
            @Parameter(name = "department") @RequestParam String department, 
            @Parameter(name = "licenseAllocated") @RequestParam String licenseAllocated, 
            @Parameter(name = "licensePurchaseDate") @RequestParam LocalDateTime licensePurchaseDate, 
            @Parameter(name = "licenseExpirationDate") @RequestParam LocalDateTime licenseExpirationDate ) {
        
        DatabaseEntry database_entry = new DatabaseEntry();

        database_entry.setName(name);
        database_entry.setEmail(email);
        database_entry.setDepartment(department);
        database_entry.setLicenseAllocated(licenseAllocated);
        database_entry.setLicensePurchaseDate(licensePurchaseDate);
        database_entry.setLicenseExpirationDate(licenseExpirationDate);
      
        DatabaseEntry saved_database_entry = databaseEntryRepository.save(database_entry);
        return saved_database_entry;
    }

    @Operation(summary = "Delete a DatabaseEntry")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteDatabaseEntry(
            @Parameter(name = "id") @RequestParam Long id) {
        DatabaseEntry database_entry = databaseEntryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(DatabaseEntry.class, id));

        databaseEntryRepository.delete(database_entry);
        return genericMessage("DatabaseEntry with id %s deleted".formatted(id));
    }

    @Operation(summary = "Update a single database_entry")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public DatabaseEntry updateDatabaseEntry(
            @Parameter(name = "id") @RequestParam Long id,
            @RequestBody @Valid DatabaseEntry incoming) {

        DatabaseEntry database_entry = databaseEntryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(DatabaseEntry.class, id));

        database_entry.setName(incoming.getName());
        database_entry.setEmail(incoming.getEmail());
        database_entry.setDepartment(incoming.getDepartment());
        database_entry.setLicenseAllocated(incoming.getLicenseAllocated());
        database_entry.setLicensePurchaseDate(incoming.getLicensePurchaseDate());
        database_entry.setLicenseExpirationDate(incoming.getLicenseExpirationDate());

        databaseEntryRepository.save(database_entry);

        return database_entry;
    }
}