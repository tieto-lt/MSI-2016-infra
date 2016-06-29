package lt.msi2016.operator_mock

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.google.common.cache.CacheBuilder
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.EnableCaching
import org.springframework.cache.guava.GuavaCacheManager
import org.springframework.context.annotation.Bean
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.client.RestTemplate
import java.util.concurrent.TimeUnit


@EnableScheduling
@EnableCaching
@SpringBootApplication
open class Application {

    @Bean
    open fun objectMapperBuilder(): Jackson2ObjectMapperBuilder {
        return Jackson2ObjectMapperBuilder().modulesToInstall(KotlinModule());
    }

    @Bean
    open fun restTemplate(objectMapper: ObjectMapper): RestTemplate {
        return RestTemplate(listOf(MappingJackson2HttpMessageConverter(objectMapper)));
    }

    @Bean
    open fun cacheManager() : CacheManager {
        val guavaCacheManager =  GuavaCacheManager(); // dynamic cache manager
        guavaCacheManager.setCacheBuilder(CacheBuilder.newBuilder()
                .expireAfterWrite(1, TimeUnit.HOURS))
        return guavaCacheManager;
    }
}

fun main(args: Array<String>) {
    SpringApplication.run(Application::class.java, *args)
}
