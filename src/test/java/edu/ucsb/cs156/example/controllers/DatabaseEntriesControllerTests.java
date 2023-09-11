package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.DatabaseEntry;
import edu.ucsb.cs156.example.repositories.DatabaseEntryRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = DatabaseEntriesController.class)
@Import(TestConfig.class)
public class DatabaseEntriesControllerTests extends ControllerTestCase {

        @MockBean
        DatabaseEntryRepository databaseEntryRepository;

        @MockBean
        UserRepository userRepository;

        // Authorization tests for /api/phones/admin/all

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/database_entries/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/database_entries/all"))
                                .andExpect(status().is(200)); // logged
        }

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/database_entries?id=7"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        // Authorization tests for /api/phones/post
        // (Perhaps should also have these for put and delete)

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/database_entries/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/database_entries/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        // // Tests with mocks for database actions

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange

                DatabaseEntry databaseEntry = DatabaseEntry.builder()
                                .name("Shrinp")
                                .email("shrimp@ucsb.edu")
                                .build();

                when(databaseEntryRepository.findById(eq(7L))).thenReturn(Optional.of(databaseEntry));  // Check not sure why id is 7

                // act
                MvcResult response = mockMvc.perform(get("/api/database_entries?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(databaseEntryRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(databaseEntry);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(databaseEntryRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/database_entries?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(databaseEntryRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("DatabaseEntry with id 7 not found", json.get("message"));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_database_entries() throws Exception {

                // arrange

                DatabaseEntry databaseEntry1 = DatabaseEntry.builder()
                                .name("Shrinp")
                                .email("shrimp@ucsb.edu")
                                .build();

                DatabaseEntry databaseEntry2 = DatabaseEntry.builder()
                                .name("Oyster")
                                .email("oyster@ucsb.edu")
                                .build();

                ArrayList<DatabaseEntry> expectedDatabaseEntries = new ArrayList<>();
                expectedDatabaseEntries.addAll(Arrays.asList(databaseEntry1, databaseEntry2));

                when(databaseEntryRepository.findAll()).thenReturn(expectedDatabaseEntries);

                // act
                MvcResult response = mockMvc.perform(get("/api/database_entries/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(databaseEntryRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedDatabaseEntries);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_database_entry() throws Exception {
                // arrange

                DatabaseEntry databaseEntry1 = DatabaseEntry.builder()
                                .name("Shrimp")
                                .email("shrimp@ucsb.edu")
                                .build();

                when(databaseEntryRepository.save(eq(databaseEntry1))).thenReturn(databaseEntry1);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/database_entries/post?name=Shrimp&email=shrimp@ucsb.edu")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(databaseEntryRepository, times(1)).save(databaseEntry1);
                String expectedJson = mapper.writeValueAsString(databaseEntry1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_database_entry() throws Exception {
                // arrange

                DatabaseEntry databaseEntry = DatabaseEntry.builder()
                                .name("Shrinp")
                                .email("shrimp@ucsb.edu")
                                .build();

                when(databaseEntryRepository.findById(eq(15L))).thenReturn(Optional.of(databaseEntry));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/database_entries?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(databaseEntryRepository, times(1)).findById(15L);
                verify(databaseEntryRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("DatabaseEntry with id 15 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_database_entry_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(databaseEntryRepository.findById(eq(15L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/database_entries?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(databaseEntryRepository, times(1)).findById(15L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("DatabaseEntry with id 15 not found", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_database_entry() throws Exception {
                // arrange

                DatabaseEntry databaseEntryOrig = DatabaseEntry.builder().id(67L)
                                .name("Shrimp")
                                .email("shrimp@ucsb.edu")
                                .build();

                DatabaseEntry databaseEntryEdited = DatabaseEntry.builder().id(67L)
                                .name("Shark")
                                .email("shark@ucsb.edu")
                                .build();

                String requestBody = mapper.writeValueAsString(databaseEntryEdited);

                when(databaseEntryRepository.findById(eq(67L))).thenReturn(Optional.of(databaseEntryOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/database_entries?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(databaseEntryRepository, times(1)).findById(67L);
                verify(databaseEntryRepository, times(1)).save(databaseEntryEdited); // should be saved with correct user
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_database_entry_that_does_not_exist() throws Exception {
                // arrange

                DatabaseEntry editedDatabaseEntry = DatabaseEntry.builder()
                                .name("Seal")
                                .email("seal@ucsb.edu")                             
                                .build();


                String requestBody = mapper.writeValueAsString(editedDatabaseEntry);

                when(databaseEntryRepository.findById(eq(67L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/database_entries?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(databaseEntryRepository, times(1)).findById(67L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("DatabaseEntry with id 67 not found", json.get("message"));

        }
}
