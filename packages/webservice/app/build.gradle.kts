import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar
import com.github.jengelman.gradle.plugins.shadow.transformers.AppendingTransformer
import com.github.jengelman.gradle.plugins.shadow.transformers.PropertiesFileTransformer
import com.moowork.gradle.node.npm.NpmTask
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

description = "app"

plugins {
    id("org.springframework.boot") version "2.3.1.RELEASE"
    id("io.spring.dependency-management") version "1.0.9.RELEASE"
    id("com.github.johnrengelman.shadow") version "5.2.0"
    id("com.moowork.node") version "1.3.1"
    kotlin("jvm")
    kotlin("plugin.spring") version "1.3.72"
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(project(":models"))
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("com.yahoo.elide", "elide-spring-boot-starter", "5.0.0-pr23")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("com.h2database", "h2", "1.3.176")
    implementation( "org.hibernate", "hibernate-validator", "6.1.5.Final")
    implementation("io.micrometer","micrometer-core", "1.5.1")
    implementation("org.projectlombok", "lombok", "1.18.10")
    testImplementation("org.springframework.boot:spring-boot-starter-test") {
        exclude(group = "org.junit.vintage", module = "junit-vintage-engine")
    }
    testImplementation("com.jayway.restassured", "rest-assured", "2.9.0")
}

tasks.withType<Test> {
    useJUnitPlatform()
    testLogging {
        events("passed", "skipped", "failed")
    }
}

tasks.withType<ProcessResources> {
    dependsOn("copyNaviApp")
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "1.8"
    }
}

tasks.register<NpmTask>("installUIDependencies") {
    setArgs(listOf("ci"))
    setExecOverrides(closureOf<ExecSpec> {
        setWorkingDir("../../../")
    })
}

tasks.register<Exec>("buildUI") {
    dependsOn("installUIDependencies")

    workingDir("../../..")

    commandLine = listOf("npx", "lerna", "run", "prodbuild", "--scope", "navi-app", "--stream")
}

tasks.register<Copy>("copyNaviApp") {
    dependsOn("buildUI")
    from("../../app/dist")
    into("$buildDir/resources/main/META-INF/resources")
}

tasks.withType<ShadowJar> {
    classifier = ""

    // Required for Spring
    mergeServiceFiles()
    append("META-INF/spring.handlers")
    append("META-INF/spring.schemas")
    transform(PropertiesFileTransformer().apply {
        paths = listOf("META-INF/spring.factories")
        mergeStrategy = "append"
    })
    manifest {
        attributes["Main-Class"] = "com.yahoo.navi.ws.AppKt"
    }
}

tasks.register<Exec>("execJar") {
    dependsOn("shadowJar")
    commandLine = listOf("java", "-jar", "build/libs/app-0.2.0.jar")
}
